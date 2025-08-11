from pathlib import Path
from typing import List, Set  # noqa: F401
import os  # noqa: F401

class ProjectTree:
    # Pastas e arquivos para ignorar
    IGNORE_DIRS = {
        '__pycache__',
        'venv_svs',
        'tools'
    }
    
    IGNORE_FILES = {
        '1.png',
        'estrutura.txt'
    }
    
    @classmethod
    def print_tree(
        cls, 
        directory: str = '.', 
        level: int = 0, 
        prefix: str = ''
    ) -> None:
        """Imprime árvore de diretórios do projeto"""
        path = Path(directory)
        
        # Imprime diretório atual
        if level == 0:
            print(f"\n📁 {path.absolute()}\n")
        
        # Lista itens do diretório
        try:
            items = sorted(path.iterdir())
        except PermissionError:
            return
            
        # Processa cada item
        for index, item in enumerate(items):
            # Ignora itens conforme regras
            if cls._should_ignore(item):
                continue
                
            is_last = index == len(items) - 1
            icon = '└──' if is_last else '├──'
            
            # Imprime item atual
            print(f"{prefix}{icon} {item.name}")
            
            # Processa subdiretórios
            if item.is_dir():
                ext_prefix = '    ' if is_last else '│   '
                cls.print_tree(
                    str(item),
                    level + 1,
                    prefix + ext_prefix
                )
    
    @classmethod
    def _should_ignore(cls, path: Path) -> bool:
        """Verifica se deve ignorar o item"""
        if path.is_dir():
            return path.name in cls.IGNORE_DIRS
            
        return any(
            path.name.endswith(p.replace('*', '')) 
            for p in cls.IGNORE_FILES
        )

if __name__ == '__main__':
    ProjectTree.print_tree()