import ast, json

def ast_to_dict(node):
    if isinstance(node, ast.AST):
        result = {"type": type(node).__name__}
        for field in node._fields:
            result[field] = ast_to_dict(getattr(node, field))
        return result
    elif isinstance(node, list):
        return [ast_to_dict(n) for n in node]
    else:
        return node

tree = ast_to_dict(ast.parse("""print("hello world")"""))
#print(json.dumps(tree))
print(tree)

def find_func(func, tree=tree):
    stuff = []
    for node in tree.keys():
        print(tree[node])
        if(tree[node] != []):
            find_func(func, tree[node])
        if(tree[node] == func):
            stuff.append(tree[node])
    print(stuff)
        
#python_dict = ast_to_dict("""hello world""")

find_func("print", tree)