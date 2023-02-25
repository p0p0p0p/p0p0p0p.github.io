Homepage: https://p0p0p0p.github.io/

Graph example:

![](./assets/images/graph_example.png)

To build locally:
1. [Install Ruby and RubyGems 2.5.0 or higher](https://www.ruby-lang.org/en/downloads/) (choose "MSYS2 and MINGW development tool chain" if applicable)
2. `gem install bundler`
3. From the GitHub Pages directory...
4. `bundle init`
5. `bundle add webrick` (fix for Ruby 3.0.0 or higher)
6. `bundle add github-pages`
7. `bundle exec jekyll serve`

See also:
* https://jekyllrb.com/docs/installation/windows/
* https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll