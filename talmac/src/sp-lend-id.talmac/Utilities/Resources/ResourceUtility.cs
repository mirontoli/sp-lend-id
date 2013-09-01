namespace sp_lend_id.talmac.Utilities.Resources
{
    using System;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Security.Cryptography;
    using System.Text;
    using System.Web;

    public class ResourceUtility
    {
        private const string BASE_URL = "/_layouts/15/sp-lend-id/talmac/Resource.ashx";
        private const string PARAM_URL = "Url";
        private const string PARAM_HASH = "hash";
        private const string SECRET = "SUGAR MAN";

        internal static string GenerateHandlerUrl(string originalUrl)
        {
            var encodedUrl = HttpUtility.UrlEncode(originalUrl);
            var hash = GenerateMD5Hash(originalUrl);
            var url = string.Format("{0}?{1}={2}&{3}={4}",
                BASE_URL, PARAM_URL, encodedUrl, PARAM_HASH, hash);
            return url;
        }
        internal static Resource GetResource(string handlerUrl)
        {
            var originalUrl = ReadAndValidateOriginalUrl(handlerUrl);
            return GetResourceByOriginalUrl(originalUrl);
        }

        private static string ReadAndValidateOriginalUrl(string handlerUrl)
        {
            //http://stackoverflow.com/questions/2884551/get-individual-query-parameters-from-uri/2884565#2884565
            //http://msdn.microsoft.com/en-us/library/ms150046.aspx
            var queryString = string.Join(string.Empty, handlerUrl.Split('?').Skip(1));
            var qscoll = HttpUtility.ParseQueryString(queryString);
            var encodedUrl = qscoll[PARAM_URL];
            var originalUrl = HttpUtility.UrlDecode(encodedUrl);

            if (qscoll[PARAM_HASH] != GenerateMD5Hash(originalUrl))
            {
                throw new Exception("the security hash is wrong. The url seems to be generated outside this solution");
            }
            
            return originalUrl;
        }

        private static string GenerateMD5Hash(string originalUrl)
        {
            var saltedInput = originalUrl + SECRET;
            var bytes = Encoding.Default.GetBytes(saltedInput);
            return MD5.Create()
                .ComputeHash(bytes)
                .Select(h => h.ToString("x2"))
                .Aggregate((current, next) => current + next);
        }

        private static Resource GetResourceByOriginalUrl(string originalUrl)
        {
            var request = WebRequest.Create(originalUrl);

            //if proxy set it
            //request.Proxy = new WebProxy { Address = new Uri("http://proxy.contoso.com") };

            byte[] result;
            var buffer = new byte[4096];


            using (var response = request.GetResponse())
            {
                using (var responseStream = response.GetResponseStream())
                {
                    using (var ms = new MemoryStream())
                    {
                        int count;
                        do
                        {
                            count = responseStream.Read(buffer, 0, buffer.Length);
                            ms.Write(buffer, 0, count);
                        } while (count != 0);
                        return new Resource
                            {
                                Content = ms.ToArray(), 
                                ContentType = response.ContentType
                            };
                    }
                }
            }
        }
    }
}
