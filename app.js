const SUPABASE_URL = "https://phxchzjvziskjjovqvlf.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "sb_publishable_xNm6ENqQz6MinoNo0kB7wA_h0d7ZSo3";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
let selectedService = "";
let loginType = "customer";

function showNotification(message) {
  const notification = document.getElementById("notification");

  if (!notification) return;

  notification.textContent = message;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3500);
}

function openRequest() {
  const section = document.getElementById("request");

  if (section) {
    section.scrollIntoView({
      behavior: "smooth"
    });
  }
}

function chooseService(serviceName) {
  selectedService = serviceName;

  const serviceInput = document.getElementById("service");

  if (serviceInput) {
    serviceInput.value = serviceName;
  }

  openRequest();
}

function scrollToHow() {
  const section = document.getElementById("how");

  if (section) {
    section.scrollIntoView({
      behavior: "smooth"
    });
  }
}

function openLogin(type = "customer") {
  loginType = type;

  const modal = document.getElementById("loginModal");

  if (modal) {
    modal.classList.add("show");
  }
}

function closeLogin() {
  const modal = document.getElementById("loginModal");

  if (modal) {
    modal.classList.remove("show");
  }
}
function showSignup() {
  const loginSection = document.getElementById("loginSection");
  const signupSection = document.getElementById("signupSection");
  const title = document.getElementById("authTitle");
  const subtitle = document.getElementById("authSubtitle");

  if (loginSection) {
    loginSection.style.display = "none";
  }

  if (signupSection) {
    signupSection.style.display = "block";
  }

  if (title) {
    title.textContent = "Create your FixLink account";
  }

  if (subtitle) {
    subtitle.textContent = "Join FixLink and get the right professional";
  }
}

function showLogin() {
  const loginSection = document.getElementById("loginSection");
  const signupSection = document.getElementById("signupSection");
  const title = document.getElementById("authTitle");
  const subtitle = document.getElementById("authSubtitle");

  if (signupSection) {
    signupSection.style.display = "none";
  }

  if (loginSection) {
    loginSection.style.display = "block";
  }

  if (title) {
    title.textContent = "Welcome to FixLink";
  }

  if (subtitle) {
    subtitle.textContent = "Sign in to continue";
  }
}
async function loginUser() {
  const email = document.getElementById("loginEmail")?.value.trim();
  const password = document.getElementById("loginPassword")?.value;

  if (!email || !password) {
    showNotification("Please enter your email and password.");
    return;
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    showNotification(error.message);
    return;
  }

  showNotification("Login successful!");

  closeLogin();

  console.log("Logged in user:", data.user);
}

async function signUpUser() {
  const name = document.getElementById("signupName")?.value.trim();
  const phone = document.getElementById("signupPhone")?.value.trim();
  const email = document.getElementById("signupEmail")?.value.trim();
  const password = document.getElementById("signupPassword")?.value;

  if (!name || !phone || !email || !password) {
    showNotification("Please complete all signup fields.");
    return;
  }

  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        full_name: name,
        phone: phone,
        user_type: document.getElementById("signupUserType").value
      }
    }
  });

  if (error) {
    showNotification(error.message);
    return;
  }

  showNotification(
    "Account created! Check your email if confirmation is required."
  );

  console.log("New user:", data.user);
}

async function submitRequest(event) {
  event.preventDefault();

  const service = document.getElementById("service")?.value.trim();
  const description = document.getElementById("description")?.value.trim();
  const location = document.getElementById("location")?.value.trim();
  const preferredTime =
    document.getElementById("preferredTime")?.value.trim();

  if (!service || !description || !location || !preferredTime) {
    showNotification("Please complete all request fields.");
    return;
  }

  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  if (!user) {
    showNotification("Please log in before submitting a request.");
    openLogin("customer");
    return;
  }

  const { data, error } = await supabaseClient
    .from("service_requests")
    .insert([
      {
        customer_id: user.id,
        service: service,
        description: description,
        location: location,
        preferred_time: preferredTime,
        status: "pending"
      }
    ])
    .select()
    .single();

  if (error) {
    console.error(error);
    showNotification("Unable to submit request. Please try again.");
    return;
  }

  showNotification("Request submitted successfully! 🔥");

  console.log("Request created:", data);

  const form = document.getElementById("requestForm");

  if (form) {
    form.reset();
  }

  selectedService = "";
}

async function checkUser() {
  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  if (user) {
    console.log("Current FixLink user:", user.email);
  } else {
    console.log("No FixLink user is currently logged in.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const requestForm = document.getElementById("requestForm");

  if (requestForm) {
    requestForm.addEventListener("submit", submitRequest);
  }

  checkUser();

  console.log("FixLink connected to Supabase.");
});
