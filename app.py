import os
from flask import Flask, render_template, request
from flask_compress import Compress
from static_routes import static_bp

app = Flask(__name__, 
            template_folder='app/template',
            static_folder='app/static')

# ADICIONAR COMPRESSÃO GZIP
compress = Compress()
compress.init_app(app)

# Configurar compressão
app.config['COMPRESS_MIMETYPES'] = [
    'text/html',
    'text/css',
    'text/xml',
    'text/javascript',
    'application/json',
    'application/javascript',
    'application/xml+rss',
    'application/atom+xml',
    'image/svg+xml'
]

app.config['COMPRESS_LEVEL'] = 6  # Nível de compressão (1-9)
app.config['COMPRESS_MIN_SIZE'] = 500  # Comprimir apenas arquivos > 500 bytes

# Registra o blueprint para arquivos estáticos
app.register_blueprint(static_bp)

@app.route('/')
def index():
    """Página principal SPA"""
    return render_template('index.html')

@app.route('/menu')
def menu_component():
    """Componente navbar para carregamento dinâmico"""
    return render_template('menu.html')

@app.route('/ad')
def ad_module():
    """Módulo AD"""
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return render_template('modules/ad.html')
    return render_template('index.html')

@app.route('/health')
def health_check():
    """Health check para Nginx"""
    nginx_proxy = request.headers.get('X-Forwarded-For')
    return {
        'status': 'ok',
        'service': 'svs-flask',
        'nginx_proxy': bool(nginx_proxy)
    }, 200

# REMOVIDO - A rota do favicon já está no static_routes.py

if __name__ == '__main__':
    # Instalar flask-compress se não estiver instalado
    try:
        import flask_compress
    except ImportError:
        print("📦 Instalando flask-compress...")
        os.system("pip install flask-compress")
        import flask_compress
    
    # Verifica se os diretórios existem
    template_dir = os.path.join(os.getcwd(), 'app', 'template')
    static_dir = os.path.join(os.getcwd(), 'app', 'static')
    
    if not os.path.exists(template_dir):
        print(f"⚠️  Diretório de templates não encontrado: {template_dir}")
    
    if not os.path.exists(static_dir):
        print(f"⚠️  Diretório static não encontrado: {static_dir}")
    
    print("🚀 Iniciando servidor Flask com compressão...")
    print("📱 Acesse: http://localhost:5000 (direto) ou http://localhost (via Nginx)")
    app.run(debug=True, host='0.0.0.0', port=5000)