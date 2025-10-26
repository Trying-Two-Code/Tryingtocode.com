
def main(run=False):
 code = [" fruit = input('orange (o) apple (a):')", ' ', " if fruit == 'o':", "  print('orange is good')", " if fruit == 'a':", "  print('apple is good')"]
 if(run):
  exec_this = ""
  for line in code:
   exec_this += line
  exec(exec_this)
 pass

def correct(code, output):
 awnsers = ['''apple is good
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
    