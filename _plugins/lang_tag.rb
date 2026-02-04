module Jekyll
  class LangBlock < Liquid::Block
    def initialize(tag_name, markup, tokens)
      super
      @lang = markup.strip
    end

    def render(context)
      site = context.registers[:site]
      # Проверка активного языка из jekyll-polyglot
      if @lang == site.active_lang
        super
      else
        ""
      end
    end
  end
end

Liquid::Template.register_tag('lang', Jekyll::LangBlock)