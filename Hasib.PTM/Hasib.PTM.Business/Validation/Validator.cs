using System;
using System.Collections.Generic;
using System.Text;

namespace Hasib.SSM.Business.Validation
{
    public class Validator
    {
        /// <summary>
        /// Returns a flag indicating whether the supplied character is a digit.
        /// </summary>
        /// <param name="c">The character to check if it is a digit.</param>
        /// <returns>True if the character is a digit, otherwise false.</returns>
        public static bool IsDigit(char c)
        {
            return c >= '0' && c <= '9';
        }

        /// <summary>
        /// Returns a flag indicating whether the supplied character is a lower case ASCII letter.
        /// </summary>
        /// <param name="c">The character to check if it is a lower case ASCII letter.</param>
        /// <returns>True if the character is a lower case ASCII letter, otherwise false.</returns>
        public static bool IsLower(char c)
        {
            return c >= 'a' && c <= 'z';
        }

        /// <summary>
        /// Returns a flag indicating whether the supplied character is an upper case ASCII letter.
        /// </summary>
        /// <param name="c">The character to check if it is an upper case ASCII letter.</param>
        /// <returns>True if the character is an upper case ASCII letter, otherwise false.</returns>
        public static bool IsUpper(char c)
        {
            return c >= 'A' && c <= 'Z';
        }

        /// <summary>
        /// Returns a flag indicating whether the supplied character is an ASCII letter or digit.
        /// </summary>
        /// <param name="c">The character to check if it is an ASCII letter or digit.</param>
        /// <returns>True if the character is an ASCII letter or digit, otherwise false.</returns>
        public static bool IsLetterOrDigit(char c)
        {
            return IsUpper(c) || IsLower(c) || IsDigit(c);
        }

        /// <summary>
        /// Returns a flag indicating whether the supplied character is an ASCII arabic letter or digit.
        /// </summary>
        /// <param name="c">The character to check if it is an ASCII arabic letter or digit.</param>
        /// <returns>True if the character is an ASCII arabic letter or digit, otherwise false.</returns>
        public static bool IsArabicLetter(char c)
        {
            return c >= 0x600 && c <= 0x6ff; //) return true;
            //if (c >= 0x750 && c <= 0x77f) return true;
            //if (c >= 0xfb50 && c <= 0xfc3f) return true;
            //if (c >= 0xfe70 && c <= 0xfefc) return true;

            //return false;
        }
    }
}
