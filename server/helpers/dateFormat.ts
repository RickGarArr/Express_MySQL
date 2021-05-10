import moment from 'moment';

export default class dateFormat {
    public static getDate(): string {
        return moment().format('YYYY-MM-DD');
    }

    public static getDateTime() :string {
        return moment().format('YYYY-MM-DD HH:mm:ss');
    }

    public static getDateFromString(fecha: string) : Date {
        return moment(fecha).toDate();
    }

    public static getDateFormat(format: string) {
        return moment().format(format);
    }

    public static getDateFromFormat(date: string, format: string) {
        return moment(date, format);
    }
}