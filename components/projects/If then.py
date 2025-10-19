
    def main():
    	x = 1
if x == 1:
 print('x is one')
else:
 print('x is not one')

    def correct(code, output):
    	awnsers = ['*
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
    