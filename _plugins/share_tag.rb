module Jekyll
    class Share < Liquid::Tag

        def initialize(tag_name, markup, tokens)
            super
            @args = markup.strip.split(/\s+/)
        end

        def render(context)
            @site = context.registers[:site]
            @all_presets = @site.config['share-presets']
            @page = context.registers[:page]

            preset_key = @args.shift
            if (@args.length == 0)
                url = "#{@site.config['url']}#{@site.config['baseurl']}#{@page['url']}"
            else
                liquid_input = Liquid::Template.parse(@args.join(" "))
                url = liquid_input.render!(context)
            end

            create_share(preset_key, url)
        end

        def create_share(preset_key, url)
            preset = @all_presets[preset_key]
            share_class = preset['class']
            children = ""
            for site in preset['sites']
                children << create_button(share_class, site, url)
            end

            "<nav class=\"#{preset['class']}\">#{children}</nav>"
        end

        def create_button(share_class, site, url)
            "<a href=\"     #{create_url(site, url)}  \"
                class=\"    #{share_class}-anchor       \"
                target=\"_blank\"
                rel=\"noopener noreferrer\">

                <i class=\" #{share_class}-icon     #{site}   #{get_icon(site)} \"></i>
            
            </a>"
        end

        def create_url(site, url)
            case site
            when "Facebook"
                share_url = "https://www.facebook.com/sharer/sharer.php?u=#{url}"
            when "X"
                share_url = "https://twitter.com/intent/tweet?url=#{url}"
            when "LinkedIn"
                share_url = "https://www.linkedin.com/sharing/share-offsite/?url=#{url}"
            when "Reddit"
                share_url = "https://www.reddit.com/submit?&url=#{url}"
            when "WhatsApp"
                share_url = "https://api.whatsapp.com/send?text=#{url}"
            when "Telegram"
                share_url = "https://t.me/share/url?url=#{url}"
            when "Messenger"
                share_url = "https://www.messenger.com/t/?link=#{url}"
            when "Devto"
                share_url = "https://dev.to/new?url=#{url}"
            when "Mail"
                share_url = "mailto:?body=#{url}"
            end
        end

        def get_icon(site)
            case site
            when "Facebook"
                icon_class = "fab fa-facebook-f"
            when "X"
                icon_class = "fab fa-x-twitter"
            when "LinkedIn"
                icon_class = "fab fa-linkedin-in"
            when "Reddit"
                icon_class = "fab fa-reddit-alien"
            when "WhatsApp"
                icon_class = "fab fa-whatsapp"
            when "Telegram"
                icon_class = "fab fa-telegram"
            when "Messenger"
                icon_class = "fab fa-facebook-messenger"
            when "Devto"
                icon_class = "fab fa-dev"
            when "Mail"
                icon_class = "fas fa-envelope"
            end
        end
    end
end

Liquid::Template.register_tag('sharebar', Jekyll::Share)