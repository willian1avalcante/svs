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

if __name__ == '__main__':
    # Verifica se os diretórios existem
    template_dir = os.path.join(os.getcwd(), 'app', 'template')
    static_dir = os.path.join(os.getcwd(), 'app', 'static')
    
    if not os.path.exists(template_dir):
        print(f"⚠️  Diretório de templates não encontrado: {template_dir}")
    
    if not os.path.exists(static_dir):
        print(f"⚠️  Diretório static não encontrado: {static_dir}")
    
    print("🚀 Iniciando servidor Flask...")
    print("📱 Acesse: http://localhost:5000")
    
    app.run(debug=True, host='0.0.0.0', port=5000)