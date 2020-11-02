import React, { Fragment, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

export const upload = (type) => {
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