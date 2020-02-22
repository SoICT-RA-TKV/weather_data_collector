import os

folders = ['airbox', 'darksky', 'openweathermap', 'wunderground']

for folder in folders:
	inp_files = os.listdir(folder + '/backup')
	out_files = []
	for i in range(len(inp_files)):
		out_files.append(folder + '/' + inp_files[i])
		if len(out_files[i]) < len(folder + '/2020-02-02.txt'):
			out_files[i] = out_files[i].split('-')
			out_files[i][-1] = '0' + out_files[i][-1]
			out_files[i] = '-'.join(out_files[i])
		inp_files[i] = folder + '/backup/' + inp_files[i]
		frstream = open(inp_files[i])
		fwstream = open(out_files[i], 'w')
		while True:
			data = frstream.readline()
			if data == None:
				break
			if len(data) <= 0:
				break
			join_string = ','
			if data.find('\t') < 0:
				join_string += '\t'
			data = data.split(',')
			for i in range(len(data)):
				idx = 0
				while (idx < len(data[i])) and ((data[i][idx] == ' ') or (data[i][idx] == '\t')):
					idx += 1
				if i == 1 and folder == 'darksky':
					print(data[i][idx:], data[i][idx:].replace(' ', '_'))
				data[i] = data[i].replace(data[i][idx:], data[i][idx:].replace(' ', '_'))
				if i == 1 and folder == 'darksky':
					print(data[i], idx)
			fwstream.write(join_string.join(data))



	# print(folder + ':')
	# print(inp_files)
	# print(out_files)