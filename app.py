import os
from flask import Flask, render_template, request
from static_routes import static_bp

app = Flask(__name__, 
            template_folder='app/template',
            static_folder='app/static')

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
    return {'status': 'ok', 'service': 'svs-flask'}, 200

if __name__ == '__main__':
    # Verifica se os diretórios existem
    template_dir = os.path.join(os.getcwd(), 'app', 'template')
    static_dir = os.path.join(os.getcwd(), 'app', 'static')
    
    if not os.path.exists(template_dir):
        print(f"⚠️  Diretório de templates não encontrado: {template_dir}")
    
    if not os.path.exists(static_dir):
        print(f"⚠️  Diretório static não encontrado: {static_dir}")
    
    # Detectar se está rodando atrás do Nginx
    nginx_proxy = os.environ.get('HTTP_X_FORWARDED_FOR') or request.headers.get('X-Forwarded-For') if 'request' in locals() else None
    
    print("🚀 Iniciando servidor Flask...")
    if nginx_proxy:
        print("🌐 Detectado proxy Nginx")
        print("📱 Acesse: http://localhost (via Nginx)")
    else:
        print("📱 Acesse: http://localhost:5000 (direto)")
    
    app.run(debug=True, host='0.0.0.0', port=5000)