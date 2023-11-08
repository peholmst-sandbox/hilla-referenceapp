import {TimeI18N} from "Frontend/i18n/TimeI18N";
import {formatPastDate} from "Frontend/i18n/RelativeTimeFormatter";
import {formatShortDateTime} from "Frontend/i18n/DateTimeFormatter";
import {useEffect, useState} from "react";

export interface RelativeTimeProps {
    date: string | Date;
    i18n?: TimeI18N
}

export default function RelativeTime(props: RelativeTimeProps) {
    const d = new Date(props.date);
    const [formattedDate, setFormattedDate] = useState(formatPastDate(d, props.i18n));
    useEffect(() => {
        const interval = setInterval(() => {
            setFormattedDate(formatPastDate(d, props.i18n));
        }, 60000);
        return () => clearInterval(interval);
    }, []);
    return <span title={formatShortDateTime(d, props.i18n)}>{formattedDate}</span>;
}