.PHONY: setup deploy verify clean
setup:
	mkdir -p ./logs /tmp
deploy:
	./smartcampus_360_os.sh
verify:
	./smartcampus_verify.sh --all
clean:
	rm -rf ./logs/*
