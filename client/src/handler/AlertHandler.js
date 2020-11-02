import { store } from 'react-notifications-component';

export const addNotification = (title, message, type) => {
    store.addNotification({
        title: title,
        message: message,
        type: type,
        insert: "top",
        container: "top-center",
        dismiss: {
            duration: 3000,
            onScreen: false
        }
    })
}