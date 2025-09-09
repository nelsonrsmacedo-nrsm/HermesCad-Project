#!/bin/bash

# Script de instalação e configuração do HermesCad CRM no Rocky Linux

# --- Variáveis de Configuração ---
REPO_URL="https://github.com/SEU_USUARIO/HermesCad-CRM.git" # **ATUALIZE COM A URL DO SEU REPOSITÓRIO NO GITHUB**
PROJECT_DIR="/opt/hermescad-crm"
PYTHON_VERSION="3.11"
NODE_VERSION="20"

# --- Funções Auxiliares ---
log_info() {
    echo "[INFO] $1"
}

log_error() {
    echo "[ERROR] $1" >&2
    exit 1
}

check_root() {
    if [ "$(id -u)" -ne 0 ]; then
        log_error "Este script deve ser executado como root ou com sudo."
    fi
}

# --- 1. Atualizar o Sistema ---
log_info "Atualizando pacotes do sistema..."
dnf update -y || log_error "Falha ao atualizar pacotes do sistema."
dnf install -y epel-release || log_error "Falha ao instalar epel-release."

# --- 2. Instalar Dependências Essenciais ---
log_info "Instalando dependências essenciais (Git, Nginx, Python, Node.js)..."
dnf install -y git nginx python3 python3-pip || log_error "Falha ao instalar Git, Nginx ou Python."

# Instalar Node.js e pnpm
curl -fsSL https://rpm.nodesource.com/setup_$NODE_VERSION.x | bash -
dnf install -y nodejs || log_error "Falha ao instalar Node.js."
npm install -g pnpm || log_error "Falha ao instalar pnpm."

# --- 3. Clonar o Repositório ---
log_info "Clonando o repositório do HermesCad CRM..."
git clone $REPO_URL $PROJECT_DIR || log_error "Falha ao clonar o repositório. Verifique a URL e permissões."
cd $PROJECT_DIR || log_error "Falha ao entrar no diretório do projeto."

# --- 4. Configuração do Backend (Flask) ---
log_info "Configurando o backend Flask..."
cd $PROJECT_DIR/hermescad || log_error "Diretório do backend não encontrado."
python$PYTHON_VERSION -m venv venv || log_error "Falha ao criar ambiente virtual Python."
source venv/bin/activate || log_error "Falha ao ativar ambiente virtual."
pip install -r requirements.txt || log_error "Falha ao instalar dependências Python."
pip install gunicorn || log_error "Falha ao instalar Gunicorn."

# Criar o banco de dados (se não existir)
python src/main.py init_db || log_error "Falha ao inicializar o banco de dados."

# --- 5. Build do Frontend (React) ---
log_info "Realizando o build do frontend React..."
cd $PROJECT_DIR/hermescad-frontend || log_error "Diretório do frontend não encontrado."
pnpm install || log_error "Falha ao instalar dependências Node.js."
pnpm run build || log_error "Falha ao realizar o build do frontend."

# Copiar o build do frontend para o diretório static do Flask
log_info "Copiando o build do frontend para o diretório static do Flask..."
rm -rf $PROJECT_DIR/hermescad/src/static/* # Limpa o diretório static existente
cp -r $PROJECT_DIR/hermescad-frontend/dist/* $PROJECT_DIR/hermescad/src/static/ || log_error "Falha ao copiar arquivos do frontend."

# --- 6. Configuração do Gunicorn (Serviço Systemd) ---
log_info "Configurando o serviço Gunicorn..."

# Criar arquivo de serviço Gunicorn
cat <<EOF > /etc/systemd/system/hermescad.service
[Unit]
Description=Gunicorn instance to serve HermesCad CRM
After=network.target

[Service]
User=nginx # Ou um usuário dedicado, como 'hermescaduser'
Group=nginx # Ou um grupo dedicado
WorkingDirectory=$PROJECT_DIR/hermescad
ExecStart=$PROJECT_DIR/hermescad/venv/bin/gunicorn --workers 3 --bind unix:$PROJECT_DIR/hermescad/hermescad.sock -m 007 src.main:app
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Habilitar e iniciar o serviço Gunicorn
systemctl daemon-reload
systemctl start hermescad
systemctl enable hermescad || log_error "Falha ao habilitar o serviço Gunicorn."

# --- 7. Configuração do Nginx (Reverse Proxy) ---
log_info "Configurando o Nginx como reverse proxy..."

# Criar arquivo de configuração do Nginx
cat <<EOF > /etc/nginx/conf.d/hermescad.conf
server {
    listen 80;
    server_name seu_dominio.com; # **ATUALIZE COM SEU DOMÍNIO OU IP DO SERVIDOR**

    location /static/ {
        alias $PROJECT_DIR/hermescad/src/static/;
        try_files \$uri \$uri/ =404;
    }

    location / {
        proxy_pass http://unix:$PROJECT_DIR/hermescad/hermescad.sock;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Testar configuração do Nginx e reiniciar
nginx -t && systemctl restart nginx || log_error "Falha na configuração ou reinício do Nginx."
systemctl enable nginx || log_error "Falha ao habilitar o serviço Nginx."

# --- 8. Ajustar Permissões ---
log_info "Ajustando permissões de diretórios..."
chown -R nginx:nginx $PROJECT_DIR || log_error "Falha ao ajustar permissões do projeto."
chmod -R 755 $PROJECT_DIR || log_error "Falha ao ajustar permissões de execução."

# --- 9. Configurar Firewall (Firewalld) ---
log_info "Configurando o firewall (Firewalld)..."
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload || log_error "Falha ao configurar o firewall."

log_info "Instalação do HermesCad CRM concluída com sucesso!"
log_info "Acesse sua aplicação em: http://seu_dominio.com (ou o IP do seu servidor)"
log_info "Lembre-se de atualizar as variáveis REPO_URL e server_name no script antes de executar."
