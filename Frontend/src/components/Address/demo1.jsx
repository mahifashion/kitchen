
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Address.css';
import PaymentNav from '../PaymentNav/PaymentNav';

const Address = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { product, size,color } = location.state || {};

    const handleSubmit = (event) => {
        event.preventDefault();
        const addressData = {
            fullName: event.target.fname.value,
            mobile: event.target.mobile.value,
            pincode: event.target.pincode.value,
            city: event.target.city.value,
            state: event.target.state.value,
            address: event.target.address.value,
            landmark: event.target.landmark.value,
        };
        navigate('/order-summary', { state: { addressData, product, size,color } });
    };

    return (
        <div>
            <div class="demotext" style="padding:50px">
                              <p><b>This text is bold</b></p>
<p><i>At our company, we prioritize the use of reputable courier services such as Fedex and DTDC to ensure the reliable shipping of our products. All shipments are fully insured to provide peace of mind to our customers.

For Cash on Delivery (COD) orders, the courier will contact you prior to delivery. If you happen to be unavailable during the scheduled delivery, you can contact the courier directly to make alternative arrangements. This includes rescheduling the delivery for a more convenient time or opting to pick up the package at the courier's designated location.

Please note that we cannot be held responsible for any delays caused by unforeseen circumstances or any delays incurred by the courier company during the delivery process. Additionally, if a customer is unavailable at the time of delivery, we cannot be held liable for any resulting delays.

Our standard shipping time is estimated to be between 3 to 7 business days. However, please be aware that this timeframe may vary depending on factors beyond our control, such as distance, weather conditions, or any unexpected events that may arise during transit.

We strive to ensure that your order reaches you in a timely manner and in perfect condition. If you have any further questions or concerns regarding our shipping policy, please feel free to contact our customer service team for assistance.</i></p>

</div>
    );
};

export default Address;

       
