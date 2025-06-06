import { useAuth, useUser } from "@clerk/clerk-react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const UserSyncHandler = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [synced, setSynced] = useState(false);
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    const saveUser = async () => {
      if (!isLoaded || !isSignedIn || synced || !user) {
        return;
      }

      try {
        const token = await getToken();

        const userData = {
          clerkId: user.id,
          email: user.primaryEmail?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
        };

        await axios.post(`${backendUrl}/users`, userData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSynced(true);
        // TODO : update the user credits
      } catch (error) {
        console.error("User sync failed", error);
        toast.error("User sync failed. Please try again");
      }
    };

    saveUser();
  }, [isLoaded, isSignedIn, getToken, user, synced, backendUrl]);

  return null;
};

export default UserSyncHandler;
