
<!doctype html>
<html <?php language_attributes(); ?>>
  <head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
  </head>
  <body>
    <div class="content">
      <?php if ( have_posts() ) {
        while ( have_posts() ) {
          the_post();
          the_content();
        }
      } ?>
    </div>
    <?php wp_footer(); ?>
</html>