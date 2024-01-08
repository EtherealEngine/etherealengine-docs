```bash
git clone https://github.com/etherealengine/etherealengine --depth 1
```
> **Warning**:  
> Adding `--depth=1` will significantly reduce the amount of data downloaded when cloning, but it will also create a `Shallow Copy` of the engine's repository.  
If you need to download any branch other than `dev`, or go back in git history into an older commit, you will have to unshallow the repository first, or else any branches and older commits won't be accessible. The command to undo cloning with `--depth=N` is either `git fetch --unshallow` or `git pull --unshallow`
