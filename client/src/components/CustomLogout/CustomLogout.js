import React from "react";
import { useNavigate } from "react-router-dom";

/* 로그아웃 기능 구현 필요해보임 */
export default function CustomLogout({ logout }) {
    const history = useNavigate();
    const handleClick = () => {
        logout();
        history("/");
    };
    return <button onClick={handleClick}>Logout</button>;
}

// export default CustomLogout