import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
import java.security.MessageDigest;
import java.math.BigInteger;

public class ComputeSHA {

    public static void main(String[] args) {
        if (args.length != 1) {
            System.out.println("Please enter an input file.");
            System.exit(1);
        }

        try {
            Scanner scanner = new Scanner(new File(args[0]));
            String content = scanner.nextLine();
            final MessageDigest md = MessageDigest.getInstance("SHA-256");
            final byte[] digest = md.digest(content.getBytes());
            BigInteger bigInt = new BigInteger(1, digest);
            String encoded = bigInt.toString(16);
            System.out.println(encoded);
        } catch (FileNotFoundException e) {
            System.out.println("File not found.");
            System.exit(1);
        } catch (Exception e) {
            System.out.println("Unknown error.");
            System.exit(1);
        }
    }

}