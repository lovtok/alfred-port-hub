// Custom password protection for static site
(function($) {
    "use strict";

    $(document).ready(function() {
        function buildUnlockedPortfolio(postId) {
            const imageNumber = postId === 65 ? '2' : '4';
            const categoryLabel = postId === 65 ? 'Video' : 'Standard';
            const titleText = postId === 65 ? 'Online Food Delivery Mobile App Design.' : 'Restaurant Mobile App Figma Design.';
            const modalTarget = '#exampleModalCenter-' + postId;

            return `
                <div class="rn-portfolio">
                    <div class="inner">
                        <span class="preview-type"><i class="bi bi-image"></i></span>
                        <div class="thumbnail">
                            <a href="${modalTarget}" data-toggle="modal" data-target="${modalTarget}">
                                <img loading="lazy" decoding="async" width="340" height="250" src="https://rainbowit.net/themes/inbio/wp-content/uploads/2021/08/portfolio-large-0${imageNumber}-340x250.jpg" class="attachment-rainbow-thumbnail-sm size-rainbow-thumbnail-sm wp-post-image" alt="portfolio-large-0${imageNumber}" />
                            </a>
                        </div>
                        <div class="content">
                            <div class="category-info">
                                <div class="category-list">
                                    <a href="https://rainbowit.net/themes/inbio/projects-cat/${postId === 65 ? 'video' : 'standard'}/">${categoryLabel}</a>
                                </div>
                                <div class="post-like pt-like-it meta">
                                    <span>
                                        <a class="like-button" href="javascript:void(0);" data-id="${postId}" data-nonce="07fc679522">
                                            <i class="bi bi-heart"></i>
                                            <span id="like-count-${postId}" class="like-count">**</span>
                                        </a>
                                    </span>
                                </div>
                            </div>
                            <h4 class="title">
                                <a href="${modalTarget}" data-toggle="modal" data-target="${modalTarget}">
                                    ${titleText}
                                    <i class="feather-arrow-up-right"></i>
                                </a>
                            </h4>
                        </div>
                    </div>
                </div>
            `;
        }

        // Override the existing password form submission
        $('.inbio-portfolio-password').off('submit').on('submit', function(e) {
            e.preventDefault();

            const form = this;
            const passwordInput = $(form).find('.userpass').val();
            const protectedData = $(this).attr('data-protectedpass');
            const parsedData = JSON.parse(protectedData);
            const postId = parsedData.post_id;
            const $portfolioItem = $('.rn-portfolio-custom-' + postId);

            // Check if password is correct (54321 for all sections)
            if (passwordInput === '54321') {
                const unlockedContent = buildUnlockedPortfolio(postId);
                $portfolioItem.html(unlockedContent);

                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 2);
                document.cookie = "userpass=" + encodeURIComponent(passwordInput) + "; path=/; expires=" + expirationDate.toUTCString();
                document.cookie = "postId=" + encodeURIComponent(postId) + "; path=/; expires=" + expirationDate.toUTCString();

                $('.inbio-errorPWdata').empty();
                localStorage.setItem('protectedContent_' + postId, 'unlocked');

                setTimeout(function() {
                    $('#exampleModalCenter-' + postId).modal('show');
                }, 100);
            } else {
                $('.rn-portfolio-custom-' + postId + ' .inbio-errorPWdata').html('<span style="color: red;">Invalid Password</span>');
            }
        });

        // Check localStorage on page load to restore unlocked content
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('protectedContent_')) {
                const postId = key.replace('protectedContent_', '');
                const status = localStorage.getItem(key);
                if (status === 'unlocked') {
                    const $portfolioItem = $('.rn-portfolio-custom-' + postId);
                    const unlockedContent = buildUnlockedPortfolio(postId);
                    $portfolioItem.html(unlockedContent);
                }
            }
        }
    });
})(jQuery);