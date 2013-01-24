test: test-node test-web

test-node:
	@echo 'Run tests on node...'
	@./ejs.test

test-web:
	@echo 'Run tests on client...'
	@nginx -p . -c nginx.conf
	@echo 'Run browsers and navigate to http://localhost:8040'
	@echo 'Press any key for complete...'
	@read r; kill `cat nginx.pid`
