(function($) {
    "use strict";
    function setTime() {
        return 100
    }
    function showTextLoading(selector) {
        $('' + selector + '').addClass('text-loading');
        $('' + selector + '').addClass('disabled')
    }
    function hideTextLoading(selector) {
        $('' + selector + '').removeClass('text-loading');
        $('' + selector + '').removeClass('disabled')
    }
    jQuery(function($) {
        const settings = window.bioShortcodeData;
        $('.inbio-password-protected').on('click', function() {
            $(this).parent().find('.inbio-protected-content-main-wrapper').addClass('inbio-protected-from-opend');
            $(this).parent().find('.portfolio-password-protected-field').addClass('inbio-protected-lock-closed');
            $(this).parent().find('.portfolio-password-protected-field').hide();
            $(this).parent().find('.inbio-password-protected-inner-content').empty().hide()
        });
        function init() {
            $('.inbio-portfolio-password').on('submit', function(e) {
                e.preventDefault();
                const form = this;
                var passwordInput = $(form).find('.userpass').val();
                var protectedData = $(this).attr('data-protectedpass');
                var parsedData = JSON.parse(protectedData);
                var postId = parsedData.post_id;
                var thumbnail_size = parsedData.thumbnail_size;
                var meta_display = parsedData.meta_display;
                var projects_meta_display = parsedData.projects_meta_display;
                var like_text = parsedData.like_text;
                var like_this_txt = parsedData.like_this_txt;
                var button_text = parsedData.button_text;
                var modal_button_txt = parsedData.modal_button_txt;
                var project_cat_display = parsedData.project_cat_display;
                var modal_popup_display = parsedData.modal_popup_display;
                var layout_style = parsedData.layout_style;
                $.post({
                    url: settings.endpoint,
                    data: {
                        'action': settings.action,
                        'bio-post-id': postId,
                        'nonce': settings.nonce,
                        'password': passwordInput,
                        thumbnail_size,
                        meta_display,
                        projects_meta_display,
                        like_text,
                        like_this_txt,
                        button_text,
                        modal_button_txt,
                        project_cat_display,
                        modal_popup_display,
                        layout_style
                    },
                    cache: !1,
                    crossDomain: !0,
                    success: function(data) {
                        if (!data.status) {
                            $('.inbio-errorPWdata').empty().append(data.message);
                            return
                        }
                        if (data.isValidPassword) {
                            var expirationDate = new Date();
                            expirationDate.setDate(expirationDate.getDate() + 2);
                            document.cookie = "userpass=" + encodeURIComponent(passwordInput) + "; path=/";
                            document.cookie = "postId=" + encodeURIComponent(postId) + "; path=/";
                            localStorage.setItem('protectedContent_' + postId, data.content);
                            $('.rn-portfolio-custom-' + postId).removeClass('rn-custom-before-login-layout')
                        } else {
                            $('.rn-portfolio-custom-' + postId + " " + '.inbio-errorPWdata').html("Invalid Password")
                        }
                        if (data.isValidPassword == !0) {
                            $('.rn-portfolio-custom-' + postId).html(data.content)
                        }
                        init()
                    },
                    error: function() {
                        console.log("Server error")
                    }
                })
            })
        }
        init();
        $(document).ready(function() {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('protectedContent_')) {
                    const postId = key.replace('protectedContent_', '');
                    const protectedContent = localStorage.getItem(key);
                    $('.rn-portfolio-custom-' + postId).html(protectedContent);
                    $('.rn-portfolio-custom-' + postId).removeClass('rn-custom-before-login-layout')
                }
            }
        })
    });
    $('#inbio-audio-label').on('click', function(e) {
        e.preventDefault();
        var isChecked = $('#inbio-audio-toggle').prop('checked');
        $('#inbio-audio-toggle').prop('checked', !isChecked);
        var audioEnable = $('#inbio-audio-toggle').prop('checked') ? 1 : 0;
        $.ajax({
            type: 'POST',
            url: inbio_ajax_obj_global.ajaxUrl,
            data: {
                action: 'inbio_save_audio_toggle_state',
                nonce: inbio_ajax_obj_global.nonce,
                audioStatus: audioEnable
            },
            success: function(response) {
                var event = new CustomEvent('valueUpdated',{
                    detail: audioEnable
                });
                window.dispatchEvent(event);
                if (audioEnable == 0) {
                    $('.uil').removeClass('feather-volume-1');
                    $('.uil').addClass('feather-volume-x')
                } else {
                    $('.uil').addClass('feather-volume-1');
                    $('.uil').removeClass('feather-volume-x')
                }
            },
            error: function(error) {}
        })
    });
    $(document).on('click', '.rbt-ajax-filter-portfolio-button button, .rainbow-portfolio-load-more', function(e) {
        e.preventDefault();
        const $this = $(this);
        const isLoadMore = $this.hasClass('rainbow-portfolio-load-more');
        const $container = $this.closest('.rn-portfolio-area');
        const $replaceArea = $container.find('.rbt-portfolio-replace-area');
        let categorySlug, queryArgs, settings, currentPage;
        if (isLoadMore) {
            categorySlug = $this.attr('data-category_slug') || 'all';
            queryArgs = $container.find('.rbt-ajax-filter-portfolio-button').attr('data-query_args');
            settings = $container.find('.rbt-ajax-filter-portfolio-button').attr('data-settings');
            currentPage = parseInt($this.attr('data-paged')) || 1;
            currentPage++
        } else {
            $this.closest('.rbt-ajax-filter-portfolio-button').find('button').removeClass('is-checked');
            $this.addClass('is-checked');
            categorySlug = $this.attr('data-category_slug');
            queryArgs = $this.closest('.rbt-ajax-filter-portfolio-button').attr('data-query_args');
            settings = $this.closest('.rbt-ajax-filter-portfolio-button').attr('data-settings');
            currentPage = 1
        }
        $this.addClass('loading').prop('disabled', !0);
        if (isLoadMore) {
            $this.find('i').removeClass('feather-loader').addClass('feather-refresh-cw spinning')
        }
        $.ajax({
            type: 'POST',
            url: inbio_ajax_obj_global.ajaxUrl,
            data: {
                action: 'inbio_get_ajax_filter_portfolio',
                categorySlug: categorySlug,
                queryArgs: queryArgs,
                settings: settings,
                paged: currentPage
            },
            success: function(response) {
                if (response.success) {
                    if (isLoadMore) {
                        $replaceArea.append(response.data.html);
                        $this.attr('data-paged', currentPage);
                        if (currentPage >= response.data.max_num_pages) {
                            $this.hide()
                        }
                    } else {
                        $replaceArea.html(response.data.html);
                        $this.siblings().removeClass('active');
                        $this.addClass('active');
                        const $loadMore = $container.find('.rainbow-portfolio-load-more');
                        $loadMore.attr('data-paged', 1).attr('data-category_slug', categorySlug);
                        if (response.data.max_num_pages > 1) {
                            $loadMore.show()
                        } else {
                            $loadMore.hide()
                        }
                    }
                }
            },
            error: function(error) {
                console.error('AJAX Error:', error)
            },
            complete: function() {
                $this.removeClass('loading').prop('disabled', !1);
                if (isLoadMore) {
                    $this.find('i').removeClass('feather-refresh-cw spinning').addClass('feather-loader')
                }
            }
        })
    });
    document.addEventListener('DOMContentLoaded', function() {
        let showTimeout;
        const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
        function showNotificationBar() {
            const notificationBar = document.getElementById('inbio-notification-bar');
            if (notificationBar) {
                notificationBar.classList.remove('notificationbar-hidden');
                notificationBar.classList.add('visible')
            }
        }
        if (typeof inbio_ajax_obj_global !== 'undefined' && inbio_ajax_obj_global.notice_bar_show_display_time) {
            if (showTimeout) {
                clearTimeout(showTimeout)
            }
            showTimeout = setTimeout(showNotificationBar, inbio_ajax_obj_global.notice_bar_show_display_time)
        }
        const notificationBar = document.getElementById("inbio-notification-bar");
        if (notificationBar) {
            let initialX, initialY;
            notificationBar.addEventListener('mousedown', function(event) {
                initialX = event.clientX - notificationBar.offsetLeft;
                initialY = event.clientY - notificationBar.offsetTop;
                document.addEventListener('mousemove', moveElement);
                document.addEventListener('mouseup', stopDragging)
            });
            function moveElement(event) {
                if (!notificationBar)
                    return;
                const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
                if (isRtl) {
                    notificationBar.style.right = `${window.innerWidth - event.clientX - (notificationBar.offsetWidth - initialX)}px`
                } else {
                    notificationBar.style.left = `${event.clientX - initialX}px`
                }
                notificationBar.style.top = `${event.clientY - initialY}px`
            }
            function stopDragging() {
                document.removeEventListener('mousemove', moveElement);
                document.removeEventListener('mouseup', stopDragging)
            }
        }
    });
    $(document).on('click', '.inbio-close-button', function() {
        const notificationBar = $('.inbio-notification-bar');
        if (notificationBar.length) {
            const isRtl = $('html').attr('dir') === 'rtl';
            if (isRtl) {
                notificationBar.css('right', '')
            } else {
                notificationBar.css('left', '')
            }
            notificationBar.fadeOut()
        }
    });
    $(document).on('click', '.rbt-iv-close-button', function(e) {
        const isRtl = $('html').attr('dir') === 'rtl';
        const videoCardWrapper = $('.rbt-intro-video-card-wrapper');
        videoCardWrapper.fadeOut()
    })
}(jQuery));
