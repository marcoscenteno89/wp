<?php

    function apirequest($data) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $data['url']);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $data['header']);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $data['request']);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data['bodycontent']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = json_decode(curl_exec($ch), true);
        $response['status_code'] = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return $response;
    }