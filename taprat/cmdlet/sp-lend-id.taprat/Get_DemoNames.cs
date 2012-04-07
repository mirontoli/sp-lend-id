namespace sp_lend_id.patrat
{
    /// <summary>
    /// This class is just a little example:
    /// http://blogs.msdn.com/b/saveenr/archive/2010/03/08/how-to-create-a-powershell-2-0-module-and-cmdlet-with-visual-studio-2010-screencast-included.aspx
    /// </summary>
    [System.Management.Automation.Cmdlet(System.Management.Automation.VerbsCommon.Get, "DemoNames")]
    public class Get_DemoNames : System.Management.Automation.PSCmdlet
    {
        protected override void ProcessRecord()
        {
            var names = new[] {"Tolle", "Sinan", "Frissan", "Ekan"};
            WriteObject(names);
        }
    }
}
