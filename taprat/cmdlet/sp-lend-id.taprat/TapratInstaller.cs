using System.ComponentModel;
using System.Management.Automation;

namespace sp_lend_id.patrat
{
    [RunInstaller(true)]
    public class TapratInstaller : PSSnapIn
    {
        public override string Name
        {
            get
            {
                return "sp-lend-id.taprat";
            }
        }

        public override string Vendor
        {
            get 
            { 
                return "Anatoly Mironov";
            }
        }

        public override string Description
        {
            get
            {
                return
                    "This includes an experimental cmdlet to activate sharepoint features and specify custom properties";
            }
        }
    }
}
