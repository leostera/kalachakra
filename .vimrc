function! Make(targets)
  call VimuxRunCommand("time make ".a:targets)
endfunction

autocmd! BufWritePost *.js     :call Make("")
autocmd! BufWritePost .ctags*  :call Make("tags")
