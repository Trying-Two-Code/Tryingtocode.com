
    def main():
    	x = 'one'
if x == 1 or x == 'one':
 print('x is one')
else:
 print('x is not one')

    def correct(code, output):
    	awnsers = ['x is not one
']
    	include = ['']
    	found = {word: False for word in include}
    	for line in code.splitlines():
    		stripped = line.split('#')[0]
    		for word in include:
    			if word in stripped:
    				found[word] = True
    	if not all(found.values()):
    		return False
    	return output in awnsers
    