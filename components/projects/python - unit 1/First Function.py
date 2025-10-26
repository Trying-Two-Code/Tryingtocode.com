
def main(run=False):
 code = [' #we can make our own functions!', ' #print() and input() are functions', ' ', ' def my_function():', "  print('function!')", ' ', ' #to call this function, say ', ' my_function()']
 if(run):
  exec_this = ""
  for line in code:
   exec_this += line
  exec(exec_this)
 pass

def correct(code, output):
 awnsers = ['''*
''']
 include = ['''''']
 found = {word: False for word in include}
 for line in code.splitlines():
  stripped = line.split('#')[0]
  for word in include:
   if word in stripped:
    found[word] = True
 if not all(found.values()):
  return False
 return output in awnsers
    