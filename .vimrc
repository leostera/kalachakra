function! Make(targets)
  call VimuxRunCommand("time make -j`nproc` ".a:targets)
endfunction

autocmd! BufWritePost *.js     :call Make("build test")
autocmd! BufWritePost .ctags*  :call Make("tags")
