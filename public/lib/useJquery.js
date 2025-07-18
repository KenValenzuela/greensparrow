'use client';

import {useEffect} from 'react';
import $ from 'jquery';

export default function useJQuery() {
    useEffect(() => {
        // put the module copy on the global so turn.js can find it
        if (typeof window !== 'undefined') {
            window.$ = $;
            window.jQuery = $;
        }
    }, []);
}
