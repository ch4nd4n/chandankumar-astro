---
title: 'fly.io on Apple M1 deployment'
date: 2021-10-17
tags:
  - docker
---
# Summary
Building and deploying docker container image from Apple Mac M1 runs into error.

```
Error Validation failed: Image must be amd64 architecture for linux us
```

fly.io runs on AMD architecture. Mac M1 is ARM. I initially resolved it by using Github action to build the container, but in case you
want to build it on your M1 and put it up in container registry, you could use `buildx`, following 3 commands did the trick for me.

```sh
docker buildx create --name mybuilder
docker buildx use mybuilder
docker buildx build --platform linux/amd64 -t ch4nd4n/homechef-menu:amd -f Dockerfile.menu --push .
```

### Older post below

While starting off with fly.io, the first tutorial worked fine, but I ran into issue when I tried the Node.js example given on the website. 
fly.io is a platform that let's you deploy your web applications(something like that). I believe it has to do something with Apple M1 chip.
Over a period of time I figured that Apple M1 is kind of pain, especially when working with Docker/Kubernetes etc.

The error looked like

```log
#                                                                                                                                                                                                           
# Fatal process OOM in Failed to reserve virtual memory for CodeRange                                                                                                                                       
#                                                                                                                                                                                                           
                                                                                                                                                                                                            
qemu: uncaught target signal 5 (Trace/breakpoint trap) - core dumped                                                                                                                                        
ERROR: failed to build: exit status 133    
```

A quick Google search did not help me much, but Docker has been a pain on M1, although to be fair, it's not really ARM fault, but x86 is
more prominently used.

### Solution

Having no access to AMD/X86 I took a different path, I used Github Action to build it. If you care to read more, refer to the documents below.
The code is just a simple fastify containerized. To create x86 package I used Github Action and published the content to Github packages.

Last step was to update the fly.toml file with something like

```toml
[build]
   image = "ghcr.io/ch4nd4n/fastify-example:feature-dockerize"
```

### References

1. [Git commit](https://github.com/ch4nd4n/fastify-example/commit/368036f1744cdcbc005062637159076cbee906e4) to build Docker image(X86)
2. [Git Package Documentation](https://docs.github.com/en/actions/publishing-packages/publishing-docker-images) for the above. I really did not make any code change. Just copied over the content.
