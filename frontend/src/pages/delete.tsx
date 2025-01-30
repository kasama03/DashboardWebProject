import React from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { SquareX } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";

const Delete: React.FC = () => {


  return (
    <Dialog>
      <DialogTrigger className="flex justify-center items-center w-full bg-transparent">
        <SquareX className="text-[#F26522]" />
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader className="items-center">
        <DialogTitle>ลบข้อมูล</DialogTitle>
          <DialogDescription className="text-center font-medium text-base">
            คุณต้องการลบข้อมูลของรายวิชานี้ใช่หรือไม่ ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center gap-x-4 pr-10">
          <DialogClose asChild>
            <Button className="button-secondary w-44">
              ตกลง
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button className="button-default w-44">
              ยกเลิก
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Delete;
