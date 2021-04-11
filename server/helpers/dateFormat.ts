import moment from 'moment';

export default class dateFormat {
    public static getDate(): string {
        return moment().format('YYYY-MM-DD');
    }

    public static getDateTime() :string {
        return moment().format('YYYY-MM-DD HH:mm:ss');
    }
}