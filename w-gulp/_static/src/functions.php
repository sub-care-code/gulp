<?php

function wpro_scripts() {
  wp_enqueue_style( 'wp-style', get_stylesheet_uri(), array(),'1.0.0','all');
}
add_action( 'wp_enqueue_scripts','wpro_scripts');