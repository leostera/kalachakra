function! Make(targets)
  call VimuxRunCommand("time make -j`nproc` ".a:targets)
endfunction

autocmd! BufWritePost *.js     :call Make("ci")
autocmd! BufWritePost .ctags*  :call Make("tags")
