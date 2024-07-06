<?php

if ( !defined( 'ABSPATH' ) ) {
	http_response_code( 404 );
	die();
}

class ds_check_white extends be_module {
	public function process( $ip, &$stats = array(), &$options = array(), &$post = array() ) {
		$email = $post['email'];
		// $p = print_r( $post, true );
		// if ( $post['email'] == 'email@example.com' ) {
		// return false; // use to test plugin
		// }
		// can't ever block local server because of cron jobs
		$ip = ds_get_ip(); // we are losing IP occasionally
		// for addons
		$addons = array();
		$addons = apply_filters( 'ds_addons_allow', $addons );
		// these are the allow before addons
		// returns array 
		// [0] = class location,
		// [1] = class name (also used as counter),
		// [2] = addon name,
		// [3] = addon author,
		// [4] = addon description
		if ( !empty( $addons ) && is_array( $addons ) ) {
			foreach ( $addons as $add ) {
				if ( !empty( $add ) && is_array( $add ) ) {
					$reason = be_load( $add, ds_get_ip(), $stats, $options, $post );
					if ( $reason !== false ) {
						// need to log a passed hit on post here
						ds_log_good( ds_get_ip(), $reason, $add[1], $add ); // added get IP because it might be altered
						return $reason;
					}
				}
			}
		}
		// checks the list of Allow List items according to the options being set
		// if Cloudflare or IP is local then the block tests for IPs are not done
		$actions = array(
			'chkcloudflare',
			// moved back as first check because it fixes the IP if it is Cloudflare
			'chkadminlog',
			'chkaws',
			'chkgcache',
			'chkgenallowlist',
			'chkgoogle',
			'chkmiscallowlist',
			'chkpaypal',
			'chkform',
			'chkwooform',
			'chkgvform',
			'chkwpform',
			'chkscripts',
			// 'chkvalidip', // handled in block testing
			'chkwlem',
			'chkwluserid',
			'chkwlistemail',
			'chkwlist',
			'chkyahoomerchant'
		);
		if ( !isset( $options['chkwlistemail'] ) ) {
			$options['chkwlistemail'] = 'Y';
		}
		foreach ( $actions as $chk ) {
			if ( $options[$chk] == 'Y' ) {
				$reason = be_load( $chk, ds_get_ip(), $stats, $options, $post );
				if ( $reason !== false ) {
					// need to log a passed hit on post here
					ds_log_good( ds_get_ip(), $reason, $chk );
					return $reason;
				}
			} else {
			// sfs_debug_msg( 'no wl check ' .$chk );
			}
		}
		// these are the allow after addons
		// returns array 
		// [0] = class location,
		// [1] = class name (also used as counter),
		// [2] = addon name,
		// [3] = addon author,
		// [4] = addon description
		return false;
	}
}

?>