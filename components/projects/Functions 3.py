
    def main():
    	def my_print(number):
 print(f'the number is {number}')

for i in range(2, 11):
 my_print(i)

    def correct(code, output):
    	awnsers = ['the number is 3
the number is 4
the number is 5
the number is 6
the number is 7
the number is 8
the number is 9
the number is 10
the number is 11
the number is 12
the number is 13
the number is 14
the number is 15
the number is 16
the number is 17
the number is 18
the number is 19
the number is 20
the number is 21
the number is 22
the number is 23
the number is 24
the number is 25
the number is 26
the number is 27
the number is 28
the number is 29
the number is 30
the number is 31
the number is 32
the number is 33
the number is 34
the number is 35
the number is 36
the number is 37
the number is 38
the number is 39
the number is 40
the number is 41
the number is 42
the number is 43
the number is 44
the number is 45
the number is 46
the number is 47
the number is 48
the number is 49
the number is 50
the number is 51
the number is 52
the number is 53
the number is 54
the number is 55
the number is 56
the number is 57
the number is 58
the number is 59
the number is 60
the number is 61
the number is 62
the number is 63
the number is 64
the number is 65
the number is 66
the number is 67
the number is 68
the number is 69
the number is 70
the number is 71
the number is 72
the number is 73
the number is 74
the number is 75
the number is 76
the number is 77
the number is 78
the number is 79
the number is 80
the number is 81
the number is 82
the number is 83
the number is 84
the number is 85
the number is 86
the number is 87
the number is 88
the number is 89
the number is 90
the number is 91
the number is 92
the number is 93
the number is 94
the number is 95
the number is 96
the number is 97
the number is 98
the number is 99
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
    