import Swal from "sweetalert2";

export const showSwal = ({
  icon = "info",
  title = "",
  text = "",
  timer = 1500,
  showConfirmButton = false,
} = {}) => {
  return Swal.fire({
    icon,
    title,
    text,
    timer,
    showConfirmButton,
    customClass: { popup: "swal-popup-zindex" },
    didOpen: () => Swal.getPopup().focus(),
  });
};

export const confirmSwal = ({
  title = "Are you sure?",
  text = "This action cannot be undone.",
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  confirmButtonColor = "#3085d6",
  cancelButtonColor = "#d33",
  icon = "warning",
} = {}) => {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor,
    cancelButtonColor,
    customClass: { popup: "swal-popup-zindex" },
    didOpen: () => Swal.getPopup().focus(),
  });
};
