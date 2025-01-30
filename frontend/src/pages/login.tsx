import React, { useState, useContext } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Navbar from "@/component/navbar/navbar";
import { useNavigate } from "react-router-dom";
import { LoginService } from "@/services/https/httpRequest";
import { AuthContext } from "@/AuthContext";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();
  const { checkAuthentication } = useContext(AuthContext);

  async function onFinish() {
    console.log("Attempting login with:", username, password);
    try {
      let res = await LoginService({ user_name: username, password: password });
      if (res.status) {
        const userInfo = { ID: res.data.id.toString() };
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("UserInfo", JSON.stringify(userInfo));
        console.log("Login successfully");

        checkAuthentication();

        setIsNavigating(true);
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      } else {
        console.error(res.message);
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: `url(https://elearning2.sut.ac.th/pluginfile.php/1/theme_suranaree/mainbgimg/1733990438/E_learing%20art_Day%2016_9_min.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        margin: 0,
        padding: 0,
      }}
    >
      <Navbar />
      <div className="flex justify-center items-center h-screen">
        <form>
          <Card className="w-auto">
            <CardHeader className="font-normal text-xl">
              <CardTitle>เข้าสู่ระบบ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="username" className="text-left font-normal">
                  ชื่อผู้ใช้
                </Label>
                <Input
                  name="username"
                  id="username"
                  value={username}
                  placeholder=" "
                  className="w-72"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-2 mt-4">
                <Label htmlFor="password" className="text-left font-normal">
                  รหัสผ่าน
                </Label>
                <div className="relative">
                  <Input
                    name="password"
                    id="password"
                    value={password}
                    placeholder=" "
                    type={showPassword ? "text" : "password"}
                    className="w-72 pr-10"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute text-gray-600"
                    onClick={togglePasswordVisibility}
                  >
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between w-full">
              <div>
                <Button
                  className="button-secondary w-72 font-medium"
                  onClick={onFinish}
                  type="button"
                >
                  Login
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}

export default Login;
