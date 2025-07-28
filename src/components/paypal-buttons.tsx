'use client'

import { PayPalButtons, OnApproveData, OnApproveActions } from "@paypal/react-paypal-js";
import { createOrder, captureOrder } from "@/app/paypal-actions";

type PaypalButtonsProps = {
    amount: string;
    onSuccess: (details: any) => void;
    onError: (err: any) => void;
}

const PaypalButtonsComponent = ({ amount, onSuccess, onError }: PaypalButtonsProps) => {

    const handleCreateOrder = async () => {
        try {
            const orderId = await createOrder(amount);
            return orderId;
        } catch (error) {
            console.error("Error creating order:", error);
            onError("Failed to create PayPal order.");
            throw new Error("Failed to create order");
        }
    };

    const handleOnApprove = async (data: OnApproveData, actions: OnApproveActions) => {
        try {
            const details = await captureOrder(data.orderID);
            onSuccess(details);
        } catch (error) {
            console.error("Error capturing order:", error);
            onError("Failed to capture PayPal order.");
            throw new Error("Failed to capture order");
        }
    };

    return (
        <PayPalButtons
            style={{ layout: "vertical", color: 'blue', shape: 'rect', label: 'paypal' }}
            createOrder={handleCreateOrder}
            onApprove={handleOnApprove}
            onError={onError}
        />
    );
};

export default PaypalButtonsComponent;
