from flask import Blueprint, send_from_directory, abort

static_bp = Blueprint('static_files', __name__)

# =====================================================
# ROTA GERAL PARA ARQUIVOS ESTÁTICOS
# =====================================================
@static_bp.route('/static/<path:filename>')
def serve_static(filename):
    """Serve arquivos estáticos do diretório app/static"""
    try:
        return send_from_directory('app/static', filename)
    except FileNotFoundError:
        abort(404)

# =====================================================
# CSS
# =====================================================
@static_bp.route('/static/css/<path:filename>')
def serve_css(filename):
    """Serve arquivos CSS"""
    try:
        return send_from_directory('app/static/css', filename)
    except FileNotFoundError:
        abort(404)

# =====================================================
# JAVASCRIPT
# =====================================================
@static_bp.route('/static/js/<path:filename>')
def serve_js(filename):
    """Serve arquivos JavaScript"""
    try:
        return send_from_directory('app/static/js', filename)
    except FileNotFoundError:
        abort(404)

@static_bp.route('/static/js/core/<path:filename>')
def serve_js_core(filename):
    """Serve arquivos JavaScript do core"""
    try:
        return send_from_directory('app/static/js/core', filename)
    except FileNotFoundError:
        abort(404)

@static_bp.route('/static/js/components/<path:filename>')
def serve_js_components(filename):
    """Serve arquivos JavaScript de componentes"""
    try:
        return send_from_directory('app/static/js/components', filename)  # CORRIGIDO: componentes -> components
    except FileNotFoundError:
        abort(404)

# =====================================================
# DADOS JSON
# =====================================================
@static_bp.route('/static/data/<path:filename>')
def serve_data(filename):
    """Serve arquivos de dados JSON"""
    try:
        return send_from_directory('app/static/data', filename)
    except FileNotFoundError:
        abort(404)

# =====================================================
# IMAGENS
# =====================================================
@static_bp.route('/static/images/<path:filename>')
def serve_images(filename):
    """Serve arquivos de imagem"""
    try:
        return send_from_directory('app/static/images', filename)
    except FileNotFoundError:
        abort(404)

# =====================================================
# VENDORS ESPECÍFICOS
# =====================================================
@static_bp.route('/static/vendor/bootstrap/<path:filename>')
def serve_bootstrap(filename):
    """Serve arquivos do Bootstrap"""
    try:
        return send_from_directory('app/static/vendor/bootstrap', filename)
    except FileNotFoundError:
        abort(404)

@static_bp.route('/static/vendor/fontawesome_700/<path:filename>')
def serve_fontawesome(filename):
    """Serve arquivos do Font Awesome 7.0.0"""
    try:
        return send_from_directory('app/static/vendor/fontawesome_700', filename)
    except FileNotFoundError:
        abort(404)

@static_bp.route('/static/vendor/Chart.js-master/<path:filename>')
def serve_chartjs(filename):
    """Serve arquivos do Chart.js"""
    try:
        return send_from_directory('app/static/vendor/Chart.js-master', filename)
    except FileNotFoundError:
        abort(404)

# =====================================================
# ARQUIVOS ESPECIAIS
# =====================================================
@static_bp.route('/robots.txt')
def robots_txt():
    """Serve o arquivo robots.txt"""
    try:
        return send_from_directory('app/static', 'robots.txt')
    except FileNotFoundError:
        abort(404)