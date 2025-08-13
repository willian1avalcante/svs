import os
import mimetypes
from flask import Blueprint, send_from_directory, abort, Response

static_bp = Blueprint('static_files', __name__)

def get_optimized_headers(filename):
    """Retorna headers otimizados para arquivos estáticos"""
    mimetype, _ = mimetypes.guess_type(filename)
    
    headers = {
        'Cache-Control': 'public, max-age=86400',  # Cache por 1 dia
    }
    
    # Headers específicos por tipo de arquivo
    if mimetype:
        if mimetype.startswith('text/') or mimetype == 'application/javascript':
            headers['Cache-Control'] = 'public, max-age=3600'  # CSS/JS cache menor
            headers['Vary'] = 'Accept-Encoding'  # Para compressão
        elif mimetype.startswith('image/'):
            headers['Cache-Control'] = 'public, max-age=604800'  # Imagens cache maior (7 dias)
        elif mimetype == 'application/json':
            headers['Cache-Control'] = 'public, max-age=1800'  # JSON cache menor
    
    return headers

# =====================================================
# ROTA GERAL PARA ARQUIVOS ESTÁTICOS COM OTIMIZAÇÃO
# =====================================================
@static_bp.route('/static/<path:filename>')
def serve_static(filename):
    """Serve arquivos estáticos do diretório app/static com otimização"""
    try:
        response = send_from_directory('app/static', filename)
        
        # Adicionar headers de otimização
        for key, value in get_optimized_headers(filename).items():
            response.headers[key] = value
            
        return response
    except FileNotFoundError:
        abort(404)

# =====================================================
# CSS COM COMPRESSÃO
# =====================================================
@static_bp.route('/static/css/<path:filename>')
def serve_css(filename):
    """Serve arquivos CSS com compressão"""
    try:
        response = send_from_directory('app/static/css', filename)
        response.headers['Content-Type'] = 'text/css; charset=utf-8'
        response.headers['Cache-Control'] = 'public, max-age=3600'
        response.headers['Vary'] = 'Accept-Encoding'
        return response
    except FileNotFoundError:
        abort(404)

# =====================================================
# JAVASCRIPT COM COMPRESSÃO
# =====================================================
@static_bp.route('/static/js/<path:filename>')
def serve_js(filename):
    """Serve arquivos JavaScript com compressão"""
    try:
        response = send_from_directory('app/static/js', filename)
        response.headers['Content-Type'] = 'application/javascript; charset=utf-8'
        response.headers['Cache-Control'] = 'public, max-age=3600'
        response.headers['Vary'] = 'Accept-Encoding'
        return response
    except FileNotFoundError:
        abort(404)

@static_bp.route('/static/js/core/<path:filename>')
def serve_js_core(filename):
    """Serve arquivos JavaScript do core com compressão"""
    try:
        response = send_from_directory('app/static/js/core', filename)
        response.headers['Content-Type'] = 'application/javascript; charset=utf-8'
        response.headers['Cache-Control'] = 'public, max-age=3600'
        response.headers['Vary'] = 'Accept-Encoding'
        return response
    except FileNotFoundError:
        abort(404)

@static_bp.route('/static/js/components/<path:filename>')
def serve_js_components(filename):
    """Serve arquivos JavaScript de componentes com compressão"""
    try:
        response = send_from_directory('app/static/js/components', filename)
        response.headers['Content-Type'] = 'application/javascript; charset=utf-8'
        response.headers['Cache-Control'] = 'public, max-age=3600'
        response.headers['Vary'] = 'Accept-Encoding'
        return response
    except FileNotFoundError:
        abort(404)

# =====================================================
# IMAGENS COM CACHE OTIMIZADO
# =====================================================
@static_bp.route('/static/images/<path:filename>')
def serve_images(filename):
    """Serve arquivos de imagem com cache otimizado"""
    try:
        response = send_from_directory('app/static/images', filename)
        response.headers['Cache-Control'] = 'public, max-age=604800'  # 7 dias
        return response
    except FileNotFoundError:
        abort(404)

# =====================================================
# VENDORS COM CACHE LONGO
# =====================================================
@static_bp.route('/static/vendor/<path:filename>')
def serve_vendor(filename):
    """Serve arquivos vendor com cache longo"""
    try:
        response = send_from_directory('app/static/vendor', filename)
        response.headers['Cache-Control'] = 'public, max-age=2592000'  # 30 dias
        response.headers['Vary'] = 'Accept-Encoding'
        return response
    except FileNotFoundError:
        abort(404)

@static_bp.route('/static/vendor/bootstrap/<path:filename>')
def serve_bootstrap(filename):
    """Serve arquivos do Bootstrap com compressão"""
    try:
        response = send_from_directory('app/static/vendor/bootstrap', filename)
        
        if filename.endswith('.css'):
            response.headers['Content-Type'] = 'text/css; charset=utf-8'
        elif filename.endswith('.js'):
            response.headers['Content-Type'] = 'application/javascript; charset=utf-8'
        
        response.headers['Cache-Control'] = 'public, max-age=2592000'  # 30 dias
        response.headers['Vary'] = 'Accept-Encoding'
        return response
    except FileNotFoundError:
        abort(404)

@static_bp.route('/static/vendor/fontawesome_700/<path:filename>')
def serve_fontawesome(filename):
    """Serve arquivos do Font Awesome com compressão"""
    try:
        response = send_from_directory('app/static/vendor/fontawesome_700', filename)
        
        if filename.endswith('.css'):
            response.headers['Content-Type'] = 'text/css; charset=utf-8'
        elif filename.endswith(('.woff', '.woff2', '.ttf', '.eot')):
            response.headers['Cache-Control'] = 'public, max-age=31536000'  # 1 ano para fontes
        
        response.headers['Vary'] = 'Accept-Encoding'
        return response
    except FileNotFoundError:
        abort(404)

# =====================================================
# FAVICON E ÍCONES - CENTRALIZADOS AQUI
# =====================================================
@static_bp.route('/favicon.ico')
def favicon():
    """Serve favicon otimizado"""
    try:
        response = send_from_directory('app/static/images', 'favicon-16x16.ico')
        response.headers['Content-Type'] = 'image/vnd.microsoft.icon'
        response.headers['Cache-Control'] = 'public, max-age=86400'
        return response
    except FileNotFoundError:
        # Favicon mínimo se arquivo não existir
        favicon_data = b'\x00\x00\x01\x00\x01\x00\x10\x10\x00\x00\x01\x00\x20\x00\x68\x04\x00\x00\x16\x00\x00\x00'
        
        return Response(
            favicon_data,
            mimetype='image/vnd.microsoft.icon',
            headers={
                'Cache-Control': 'public, max-age=86400',
                'Content-Length': str(len(favicon_data))
            }
        )

@static_bp.route('/apple-touch-icon.png')
def apple_touch_icon():
    """Serve ícone para iOS"""
    try:
        response = send_from_directory('app/static/images', 'apple-touch-icon.png')
        response.headers['Content-Type'] = 'image/png'
        response.headers['Cache-Control'] = 'public, max-age=604800'
        return response
    except FileNotFoundError:
        abort(404)

# =====================================================
# ARQUIVOS ESPECIAIS OTIMIZADOS
# =====================================================
@static_bp.route('/robots.txt')
def robots_txt():
    """Serve o arquivo robots.txt com cache"""
    try:
        response = send_from_directory('app/static', 'robots.txt')
        response.headers['Content-Type'] = 'text/plain; charset=utf-8'
        response.headers['Cache-Control'] = 'public, max-age=86400'
        return response
    except FileNotFoundError:
        # Robots.txt padrão se não existir
        return Response(
            'User-agent: *\nDisallow: /static/\nDisallow: /admin/',
            mimetype='text/plain',
            headers={'Cache-Control': 'public, max-age=86400'}
        )

# =====================================================
# MANIFESTOS E METADADOS
# =====================================================
@static_bp.route('/manifest.json')
def manifest():
    """Serve manifest.json para PWA"""
    manifest_data = {
        "name": "SVS - Sistema de Vendas Skymsen",
        "short_name": "SVS",
        "description": "Sistema de Vendas Skymsen",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#ba1319",
        "icons": [
            {
                "src": "/static/images/favicon-32x32.png",
                "sizes": "32x32",
                "type": "image/png"
            }
        ]
    }
    
    import json
    return Response(
        json.dumps(manifest_data),
        mimetype='application/json',
        headers={'Cache-Control': 'public, max-age=86400'}
    )
    
    
@static_bp.route('/static/css/fontawesome-minimal.css')
def fontawesome_minimal():
    """Serve FontAwesome mínimo com apenas ícones usados"""
    
    # CSS com apenas os ícones necessários
    css_content = """
/* FontAwesome Mínimo - apenas ícones usados no SVS */
@font-face {
  font-family: 'Font Awesome 6 Free';
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: url('/static/vendor/fontawesome_700/webfonts/fa-solid-900.woff2') format('woff2');
}

.fas {
  font-family: 'Font Awesome 6 Free';
  font-weight: 900;
  font-style: normal;
  font-variant: normal;
  text-rendering: auto;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Apenas ícones realmente usados */
.fa-building::before { content: "\\f1ad"; }
.fa-info-circle::before { content: "\\f05a"; }
.fa-chevron-down::before { content: "\\f078"; }
.fa-chevron-up::before { content: "\\f077"; }
.fa-search::before { content: "\\f002"; }
.fa-times::before { content: "\\f00d"; }
.fa-user-circle::before { content: "\\f2bd"; }
.fa-calendar-days::before { content: "\\f073"; }
.fa-key::before { content: "\\f084"; }
.fa-sign-out-alt::before { content: "\\f2f5"; }
.fa-file-alt::before { content: "\\f15c"; }
.fa-ban::before { content: "\\f05e"; }
.fa-calculator::before { content: "\\f1ec"; }
.fa-shopping-cart::before { content: "\\f07a"; }
.fa-truck::before { content: "\\f0d1"; }
.fa-keyboard::before { content: "\\f11c"; }
"""
    
    return Response(
        css_content,
        mimetype='text/css',
        headers={
            'Cache-Control': 'public, max-age=31536000',  # Cache 1 ano
            'Content-Type': 'text/css; charset=utf-8',
            'Vary': 'Accept-Encoding'
        }
    )