
    def main():
    	#you can add words together

x = 'apple and '
y = 'orange '

print(x + y)

    def correct(code, output):
    	awnsers = ['apple and apple and orange orange 
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
    