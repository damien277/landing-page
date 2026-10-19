#!/bin/sh
set -eu
case " ${RENEWED_DOMAINS:-} " in
    *" hello.botanika.ai "*) /usr/sbin/nginx -t && /bin/systemctl reload nginx ;;
esac
