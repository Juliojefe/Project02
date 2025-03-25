@RestController
public class HomeController {
    @GetMapping("/")
    public String home() {
        return "TierList API is live!";
    }
}
