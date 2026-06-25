# ddc-filter-matcher_suffix

Suffix matcher for ddc.vim

It filters out items whose words do not end with the matched input suffix.

## Required

### denops.vim

https://github.com/vim-denops/denops.vim

### ddc.vim

https://github.com/Shougo/ddc.vim

## Configuration

```vim
" Use both matcher_head and matcher_suffix.
call ddc#custom#patch_global('sourceOptions', #{
      \   _: #{
      \     matchers: ['matcher_head', 'matcher_suffix'],
      \ })
```
